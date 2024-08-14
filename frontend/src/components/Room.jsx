import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Room = ({ setRoom }) => {
    const { roomcode } = useParams();
    const navigate = useNavigate();
    const [guest_can_pause, setGuest_can_pause] = useState(false);
    const [votes_to_skip, setVotes_to_skip] = useState(2);
    const [isHost, setIsHost] = useState(false);
    const [song, setSong] = useState(null);
    const [is_paused, setIs_paused] = useState(true);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        console.log(`Room code from params: ${roomcode}`);
        getRoomDetails();
        getSongInfo();

        if (!isHost) {
            const interval = setInterval(nonHostSync, 3000);
            return () => clearInterval(interval);
        }
    }, [isHost]);

    const getRoomDetails = () => {
        fetch(`/api/get-room?code=${roomcode}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Room details fetched:", data);
                setGuest_can_pause(data.guest_can_pause);
                setVotes_to_skip(data.votes_to_skip);
                setIsHost(data.is_host);
                setIs_paused(data.is_paused);

                if (data.is_paused) {
                    audioRef.current.pause();
                } else {
                    audioRef.current.play();
                }
            })
            .catch((error) => {
                console.error("Error fetching room details:", error);
            });
    };

    const getSongInfo = () => {
        fetch('/firebase/getSong')
            .then((res) => res.json())
            .then((data) => {
                setSong(data);
                if (audioRef.current && data.audio_url) {
                    audioRef.current.src = data.audio_url;
                }
            })
            .catch((error) => {
                console.error("Error fetching song info:", error);
            });
    };

    const nonHostSync = () => {
        fetch(`/api/get-room?code=${roomcode}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Non-host sync data:", data);
                if (data.is_paused !== audioRef.current.paused) {
                    if (data.is_paused) {
                        console.log("Pausing audio based on sync data.");
                        audioRef.current.pause();
                    } else {
                        console.log("Playing audio based on sync data.");
                        audioRef.current.play();
                    }
                    setIs_paused(data.is_paused);
                }
            })
            .catch((error) => {
                console.error("Error in non-host sync:", error);
            });
    };

    const leaveRoom = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/api/leave-room", requestOptions).then((r) => {
            setRoom(null);
            navigate(`/`);
        });
    };

    const playAudio = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIs_paused(false);
            updateRoomPauseState(false);
        } else {
            console.log("Audio is already playing.");
        }
    };

    const pauseAudio = () => {
        if (!audioRef.current.paused) {
            audioRef.current.pause();
            setIs_paused(true);
            updateRoomPauseState(true);
        } else {
            console.log("Audio is already paused.");
        }
    };

    const updateRoomPauseState = (paused) => {
        if (!roomcode) {
            console.error("Room code is missing, cannot update pause state.");
            return;
        }

        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                guest_can_pause: guest_can_pause,
                votes_to_skip: votes_to_skip,
                code: roomcode,
                is_paused: paused }),
        };

        fetch(`/api/update-room?code=${roomcode}`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log("Room pause state updated:", data);
            })
            .catch((error) => {
                console.error("Error updating room pause state:", error);
            });
    };

    return (
        <div className="min-h-screen bg-gray-600 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-md p-8 w-full md:w-1/2 lg:w-1/3">
                <h1 className="text-3xl font-bold text-center mb-4">Room Code: {roomcode}</h1>
                <div className="flex flex-col items-center">
                    <p className="text-gray-700 mb-2">Votes to skip: {votes_to_skip}</p>
                    <p className="text-gray-700 mb-2">Guest can pause: {guest_can_pause.toString()}</p>
                    <p className="text-gray-700 mb-2">Host: {isHost.toString()}</p>

                    {song && (
                        <>
                            <audio ref={audioRef} controls hidden={true}>
                                <source src={song.audio_url} type="audio/mp3" />
                                Your browser does not support the audio element.
                            </audio>
                            {isHost && (
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={playAudio}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ease-in-out"
                                    >
                                        Play
                                    </button>
                                    <button
                                        onClick={pauseAudio}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 ease-in-out"
                                    >
                                        Pause
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    <button
                        onClick={leaveRoom}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out"
                    >
                        Leave Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Room;
