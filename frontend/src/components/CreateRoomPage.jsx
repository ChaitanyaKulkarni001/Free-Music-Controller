import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const CreateRoomPage = ({ update, code, guest_can_pauses, votes_to_skips, getRoomDetails ,setSetting}) => {
    const [guest_can_pause, setGuest_can_pause] = useState(true);
    const [votes_to_skip, setVotes_to_skip] = useState(2);
    const [msg, setMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { roomcode } = useParams();

    useEffect(() => {
        if (update) {
            setGuest_can_pause(guest_can_pauses);
            setVotes_to_skip(votes_to_skips);
        }
    }, [update, guest_can_pauses, votes_to_skips]);

    const handleVotesChange = (e) => {
        setVotes_to_skip(e.target.value);
    };

    const handleGuest_can_pause = (e) => {
        const value = e.target.id === 'PlayPause';
        setGuest_can_pause(value);
    };

    const handleRoomButton = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votes_to_skip,
                guest_can_pause: guest_can_pause,
            }),
        };

        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setMsg("Room created successfully!");
                setIsModalOpen(true);
                console.log(data.code);
                navigate(`/room/${data.code}`);
            })
            .catch((error) => {
                console.error('Error:', error);
                setMsg("Some Error Occurred!!!");
                setIsModalOpen(true);
            });
    };

    const handleUpdateButton = () => {
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votes_to_skip,
                guest_can_pause: guest_can_pause,
                code: code
            }),
        };

        fetch("/api/update-room", requestOptions)
            .then((response) => {
                if (response.ok) {
                    setMsg("Room updated successfully!");
                    getRoomDetails();
                } else {
                    setMsg("Some Error Occurred!!!");
                }
                setIsModalOpen(true);
            })
            .catch((error) => {
                console.error('Error:', error);
                setMsg("Some Error Occurred!!!");
                setIsModalOpen(true);
            });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const title = update ? "Update " : "Create a ";

    return (
        <>
            <div className="min-h-screen bg-gray-600 flex justify-center items-center">
                <div className='bg-white rounded-lg shadow-md p-8 w-full md:w-1/2 lg:w-1/3'>
                    <h1 className="text-3xl font-bold text-center mb-4">{title}Room</h1>
                    <p className="text-gray-500 text-center mb-6">Guest Control of Playback State</p>
                    <div className="flex items-center mb-4">
                        <label htmlFor="PlayPause" className="mr-4 text-gray-700 flex items-center">
                            <input
                                type="radio"
                                onChange={handleGuest_can_pause}
                                checked={guest_can_pause}
                                name="control"
                                id="PlayPause"
                                className="mr-2"
                            />
                            Play/Pause
                        </label>
                        <label htmlFor="NoControl" className="text-gray-700 flex items-center">
                            <input
                                type="radio"
                                onChange={handleGuest_can_pause}
                                checked={!guest_can_pause}
                                name="control"
                                id="NoControl"
                                className="mr-2"
                            />
                            No Control
                        </label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input
                            className="border border-gray-300 rounded-md p-2 text-center w-16 mr-2"
                            type="number"
                            name="number"
                            id="number"
                            value={votes_to_skip}
                            onChange={handleVotesChange}
                            min="0"
                            placeholder="0"
                        />
                        <p className="text-gray-700">Votes Required to Skip Song</p>
                    </div>
                    <div className="flex flex-col">
                        {update ? (
<>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white my-3 p-2 rounded-md transition duration-300 ease-in-out"
                                onClick={handleUpdateButton}
                                >
                                Update Room
                            </button>
                            <button className='bg-pink-500 text-white  p-2 rounded-md transition duration-300 ease-in-out  hover:bg-pink-700' onClick={()=>{setSetting(false)}}>Back to Room</button>
                              </>
                        ) : (
                          <>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white my-3 p-2 rounded-md transition duration-300 ease-in-out"
                                onClick={handleRoomButton}
                                >
                                Create a Room
                            </button>
                        <Link to="/" className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                            <span className='flex justify-center text-center items-center'>Back</span>
                        </Link>
                              </>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex  justify-center items-start bg-gray-700 bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-sm w-full">
                        <h2 className="text-2xl font-bold mb-4">{msg}</h2>
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateRoomPage;
