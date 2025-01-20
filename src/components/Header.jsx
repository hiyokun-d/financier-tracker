import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, RotateCcw, AlertTriangle } from 'lucide-react';
import anime from 'animejs';

export const Header = ({ notificationsOn, setNotificationsOn, onResetBudget }) => {
    const [showModal, setShowModal] = useState(false);
    const logoRef = useRef(null);
    const titleRef = useRef(null);
    const buttonsRef = useRef(null);
    const resetButtonRef = useRef(null);
    const resetIconRef = useRef(null);
    const modalRef = useRef(null);
    const modalContentRef = useRef(null);
    const warningIconRef = useRef(null);
    const modalTitleRef = useRef(null);
    const modalTextRef = useRef(null);
    const modalButtonsRef = useRef(null);

    // Initial header animation
    useEffect(() => {
        if (window.innerWidth <= 768) {
            const timeline = anime.timeline({
                easing: 'spring(1, 80, 12, 0)',
                duration: 1000
            });

            timeline
                .add({
                    targets: logoRef.current,
                    scale: [0.3, 1],
                    opacity: [0, 1],
                    rotate: ['-45deg', '0deg'],
                    duration: 1200
                })
                .add({
                    targets: titleRef.current,
                    translateX: [-30, 0],
                    opacity: [0, 1],
                    duration: 800,
                    easing: 'spring(1, 90, 10, 0)'
                }, '-=800')
                .add({
                    targets: buttonsRef.current.children,
                    translateY: [-20, 0],
                    opacity: [0, 1],
                    scale: [0.8, 1],
                    duration: 600,
                    delay: anime.stagger(100),
                    easing: 'spring(1, 90, 8, 0)'
                }, '-=400');
        }
    }, []);

    // Enhanced notification button animation
    const handleNotificationClick = () => {
        if (window.innerWidth <= 768) {
            anime({
                targets: buttonsRef.current.children[0],
                scale: [1, 0.9, 1],
                rotate: ['0deg', '15deg', '-15deg', '0deg'],
                duration: 600,
                easing: 'spring(1, 80, 10, 0)'
            });
        }
        setNotificationsOn(!notificationsOn);
    };

    // Enhanced reset button and modal opening animation
    const handleResetClick = () => {
        // Button press animation
        anime({
            targets: resetButtonRef.current,
            scale: [1, 0.85, 1],
            rotate: ['0deg', '-20deg', '0deg'],
            duration: 400,
            easing: 'spring(1, 80, 10, 0)'
        });

        setShowModal(true);

        // Modal opening animation sequence
        const timeline = anime.timeline({
            easing: 'easeOutExpo'
        });

        timeline
            .add({
                targets: modalRef.current,
                backgroundColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
                backdropFilter: ['blur(0px)', 'blur(8px)'],
                duration: 400,
                easing: 'easeOutCubic'
            })
            .add({
                targets: modalContentRef.current,
                translateY: ['100%', '0%'],
                duration: 600,
                easing: 'spring(1, 85, 12, 0)',
            }, '-=200')
            .add({
                targets: warningIconRef.current,
                scale: [0.5, 1],
                rotate: ['45deg', '0deg'],
                opacity: [0, 1],
                duration: 800,
                easing: 'spring(1, 80, 10, 0)',
            }, '-=400')
            .add({
                targets: [modalTitleRef.current, modalTextRef.current],
                translateY: [20, 0],
                opacity: [0, 1],
                duration: 600,
                delay: anime.stagger(100),
                easing: 'spring(1, 90, 8, 0)',
            }, '-=600')
            .add({
                targets: modalButtonsRef.current.children,
                translateY: [20, 0],
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 600,
                delay: anime.stagger(100),
                easing: 'spring(1, 90, 8, 0)',
            }, '-=400');
    };

    // Enhanced modal closing animation
    const closeModal = () => {
        const timeline = anime.timeline({
            easing: 'easeOutQuint'
        });

        timeline
            .add({
                targets: [modalButtonsRef.current.children, modalTitleRef.current, modalTextRef.current],
                translateY: [0, 10],
                opacity: [1, 0],
                duration: 200,
                delay: anime.stagger(50),
            })
            .add({
                targets: warningIconRef.current,
                scale: [1, 0.8],
                opacity: [1, 0],
                duration: 200,
            }, '-=100')
            .add({
                targets: modalContentRef.current,
                translateY: ['0%', '100%'],
                duration: 300,
                easing: 'easeInOutQuart',
            }, '-=100')
            .add({
                targets: modalRef.current,
                backgroundColor: ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)'],
                backdropFilter: ['blur(8px)', 'blur(0px)'],
                duration: 300,
                complete: () => setShowModal(false),
            }, '-=200');
    };

    // Enhanced reset confirmation animation
    const handleReset = () => {
        const timeline = anime.timeline({
            easing: 'easeOutExpo'
        });

        timeline
            .add({
                targets: warningIconRef.current,
                scale: [1, 1.2],
                rotate: ['0deg', '45deg'],
                opacity: [1, 0],
                duration: 300,
            })
            .add({
                targets: [modalButtonsRef.current.children, modalTitleRef.current, modalTextRef.current],
                translateY: [0, -10],
                opacity: [1, 0],
                scale: [1, 0.9],
                duration: 200,
                delay: anime.stagger(50),
            }, '-=200')
            .add({
                targets: modalContentRef.current,
                translateY: ['0%', '100%'],
                scale: [1, 0.95],
                duration: 400,
                easing: 'easeInOutQuart',
            }, '-=100')
            .add({
                targets: modalRef.current,
                backgroundColor: ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)'],
                backdropFilter: ['blur(8px)', 'blur(0px)'],
                duration: 300,
                complete: () => {
                    setShowModal(false);
                    onResetBudget();
                },
            }, '-=200');
    };

    return (
        <>
            <div className="flex justify-between items-center w-full px-3 py-3 bg-white/80 backdrop-blur-sm fixed top-0 z-40 shadow-sm">
                <div className="flex items-center space-x-3 overflow-y-hidden">
                    <div ref={logoRef} className="w-12 h-12 md:w-16 md:h-16 overflow-hidden rounded-full">
                        <img
                            src="/logo.webp"
                            alt="Hiyo's logo"
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
                        />
                    </div>
                    <h1
                        ref={titleRef}
                        className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-300 text-transparent bg-clip-text"
                    >
                        Welcome! Hiyo
                    </h1>
                </div>

                <div ref={buttonsRef} className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={handleNotificationClick}
                        className="relative p-2 hover:bg-gray-100 transition-colors duration-200"
                    >
                        {notificationsOn ? (
                            <Bell className="h-5 w-5 text-blue-600" />
                        ) : (
                            <BellOff className="h-5 w-5 text-gray-400" />
                        )}
                    </Button>

                    <Button
                        ref={resetButtonRef}
                        onClick={handleResetClick}
                        className="relative h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600 transform transition-all duration-200 ease-out group active:scale-95"
                        variant="destructive"
                        size="icon"
                    >
                        <span ref={resetIconRef} className="transition-transform group-hover:rotate-12">
                            <RotateCcw className="w-4 h-4" />
                        </span>
                    </Button>
                </div>
            </div>

            {showModal && (
                <div
                    ref={modalRef}
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 touch-none backdrop-blur-[8px]"
                    onClick={(e) => e.target === modalRef.current && closeModal()}
                >
                    <div
                        ref={modalContentRef}
                        className="bg-white dark:bg-gray-900 w-full max-w-lg mx-4 mb-4 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-center">
                                <div
                                    ref={warningIconRef}
                                    className="bg-red-100 dark:bg-red-900/30 p-3 rounded-2xl"
                                >
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                            </div>

                            <div className="space-y-2 text-center">
                                <h3
                                    ref={modalTitleRef}
                                    className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                                >
                                    Reset Budget?
                                </h3>
                                <p
                                    ref={modalTextRef}
                                    className="text-sm text-gray-600 dark:text-gray-400"
                                >
                                    This will reset your entire budget tracking to zero. This action cannot be undone.
                                </p>
                            </div>

                            <div ref={modalButtonsRef} className="space-y-3">
                                <Button
                                    className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium rounded-2xl"
                                    onClick={handleReset}
                                >
                                    Reset Budget
                                </Button>

                                <Button
                                    className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-2xl"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};