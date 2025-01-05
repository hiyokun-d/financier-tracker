import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import anime from 'animejs';

export const Header = ({ notificationsOn, setNotificationsOn }) => {
    const logoRef = useRef(null);
    const titleRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        // Only run animations on mobile devices
        if (window.innerWidth <= 768) {
            // Initial animation timeline
            const timeline = anime.timeline({
                easing: 'easeOutElastic(1, .8)',
                duration: 800
            });

            timeline
                .add({
                    targets: logoRef.current,
                    scale: [0.5, 1],
                    opacity: [0, 1],
                    rotate: ['-20deg', '0deg']
                })
                .add({
                    targets: titleRef.current,
                    translateX: [-50, 0],
                    opacity: [0, 1],
                    duration: 600
                }, '-=400')
                .add({
                    targets: buttonRef.current,
                    translateY: [-20, 0],
                    opacity: [0, 1],
                    duration: 400
                }, '-=200');
        }
    }, []);

    // Animation for button click
    const handleButtonClick = () => {
        if (window.innerWidth <= 768) {
            anime({
                targets: buttonRef.current,
                scale: [1, 1.2, 1],
                rotate: ['0deg', '20deg', '0deg'],
                duration: 400,
                easing: 'easeInOutQuad'
            });
        }
        setNotificationsOn(!notificationsOn);
    };

    return (
        <div className="flex justify-between items-center w-full px-3 py-3 bg-white/80 backdrop-blur-sm fixed top-0 z-50 shadow-sm">
            <div className="flex items-center space-x-3">
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

            <div ref={buttonRef}>
                <Button
                    variant="outline"
                    onClick={handleButtonClick}
                    className="relative p-2 hover:bg-gray-100 transition-colors duration-200"
                >
                    {notificationsOn ? (
                        <Bell className="h-5 w-5 text-blue-600" />
                    ) : (
                        <BellOff className="h-5 w-5 text-gray-400" />
                    )}
                </Button>
            </div>
        </div>
    );
};