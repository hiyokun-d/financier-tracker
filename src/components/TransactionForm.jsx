import React, { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import { Sparkles, DollarSign, FileText } from 'lucide-react';

export const TransactionForm = ({ amount, description, category, setAmount, setDescription, setCategory, addTransaction }) => {
    const formRef = useRef(null);
    const [activeInput, setActiveInput] = useState(null);
    const inputRefs = {
        amount: useRef(null),
        description: useRef(null),
    };
    const buttonRef = useRef(null);
    const iconRefs = {
        amount: useRef(null),
        description: useRef(null),
    };

    const formatAmount = (value) => {
        const number = value.replace(/[^\d]/g, ''); // Remove non-numeric characters
        if (number === '') return '';
        return parseInt(number, 10).toLocaleString('id-ID'); // Indonesian format
    };

    const handleInputChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^\d]/g, '');

        const formattedValue = formatAmount(value);
        setAmount(formattedValue);
    };

    useEffect(() => {
        if (window.innerWidth <= 768) { // Mobile-only animations
            anime({
                targets: formRef.current,
                translateY: [20, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutExpo'
            });

            // Stagger input field appearances
            anime({
                targets: Object.values(inputRefs).map(ref => ref.current),
                translateX: [-20, 0],
                opacity: [0, 1],
                delay: anime.stagger(100),
                duration: 600,
                easing: 'easeOutCubic'
            });
        }
    }, []);

    // Floating animation for icons
    useEffect(() => {
        Object.values(iconRefs).forEach(ref => {
            anime({
                targets: ref.current,
                translateY: ['-2px', '2px'],
                duration: 2000,
                direction: 'alternate',
                loop: true,
                easing: 'easeInOutQuad'
            });
        });
    }, []);

    const createParticles = (x, y, color) => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.zIndex = '1000';
        container.style.left = '0';
        container.style.top = '0';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);

        const particles = Array.from({ length: 5 }, () => {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.backgroundColor = color;
            particle.style.borderRadius = '50%';
            container.appendChild(particle);
            return particle;
        });

        anime({
            targets: particles,
            translateX: () => anime.random(-100, 100),
            translateY: () => anime.random(-100, 100),
            opacity: [1, 0],
            scale: [1, 0],
            duration: () => anime.random(1000, 1500),
            easing: 'easeOutExpo',
            complete: () => container.remove()
        });
    };

    const handleInputFocus = (inputName, e) => {
        setActiveInput(inputName);
        const rect = e.target.getBoundingClientRect();
        const color = inputName === 'amount' ? '#3B82F6' :
            inputName === 'description' ? '#10B981' : '#8B5CF6';

        createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, color);

        // Bounce animation for icon
        anime({
            targets: iconRefs[inputName].current,
            scale: [1, 1.5, 1],
            rotate: [0, 360],
            duration: 800,
            easing: 'easeOutElastic(1, .5)'
        });
    };

    const handleInputBlur = () => {
        setActiveInput(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Explosive button animation
        anime({
            targets: buttonRef.current,
            scale: [1, 0.9, 1.1, 1],
            rotate: [0, -2, 2, 0],
            duration: 400,
            easing: 'easeInOutQuad'
        });

        // Create explosion of particles
        const rect = buttonRef.current.getBoundingClientRect();
        const colors = ['#ffff', '#10B981', '#8B5CF6'];
        colors.forEach(color => createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, color));

        addTransaction(e);
    };

    const getInputWrapperClass = (inputName) => `
    relative flex items-center space-x-3 transform transition-all duration-300
    ${activeInput === inputName ? 'scale-105' : ''}
  `;
    return (
        <div className='flex justify-center items-center w-full px-4 py-3 backdrop-blur-sm shadow-sm'>
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="flex flex-col space-y-3 p-8 relative bg-black/40 backdrop-blur-md rounded-lg shadow-xl w-full max-w-md"
            >
                <div className={getInputWrapperClass('amount')}>
                    <div ref={iconRefs.amount} className="text-blue-500">
                        <DollarSign size={24} />
                    </div>
                    <input
                        ref={inputRefs.amount}
                        type="number"
                        value={amount}
                        onChange={handleInputChange}
                        onFocus={(e) => handleInputFocus('amount', e)}
                        onBlur={handleInputBlur}
                        placeholder="Amount"
                        className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg bg-white transition-all duration-300"
                    />
                </div>

                <div className={getInputWrapperClass('description')}>
                    <div ref={iconRefs.description} className="text-green-500">
                        <FileText size={24} />
                    </div>
                    <input
                        ref={inputRefs.description}
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onFocus={(e) => handleInputFocus('description', e)}
                        onBlur={handleInputBlur}
                        placeholder="Description"
                        className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg bg-white transition-all duration-300"
                    />
                </div>

                <button
                    ref={buttonRef}
                    type="submit"
                    onClick={addTransaction}
                    className="relative overflow-hidden p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transform transition-all duration-300 text-lg font-medium hover:shadow-lg active:scale-95"
                >
                    <div className="flex items-center justify-center space-x-2">
                        <Sparkles size={20} />
                        <span>Add Transaction</span>
                        <Sparkles size={20} />
                    </div>
                </button>
            </form>
        </div>
    );
}