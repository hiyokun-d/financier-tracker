import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import anime from 'animejs';
import { TrendingUp, TrendingDown, Wallet, AlertCircle, AlertTriangle, BellRing } from 'lucide-react';

export const BudgetStatus = ({ totalSpent, remaining, monthlyBudget }) => {
    const [prevTotalSpent, setPrevTotalSpent] = useState(totalSpent);
    const [prevRemaining, setPrevRemaining] = useState(remaining);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isOverBudget, setIsOverBudget] = useState(false);

    const cardRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressWrapperRef = useRef(null);
    const totalSpentRef = useRef(null);
    const remainingRef = useRef(null);
    const warningIconRef = useRef(null);
    const warningTextRef = useRef(null);
    const titleRef = useRef(null);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(value);
    };

    useEffect(() => {
        setIsOverBudget(remaining < 0 || totalSpent > monthlyBudget);
    }, [remaining, totalSpent, monthlyBudget]);

    // Dramatic over-budget animation
    const playOverBudgetAnimation = () => {
        // Shake the entire card
        anime({
            targets: cardRef.current,
            translateX: [0, -10, 10, -10, 10, 0],
            duration: 500,
            easing: 'easeInOutQuad'
        });

        // Pulse warning icon
        anime({
            targets: warningIconRef.current,
            scale: [1, 1.5, 1],
            rotate: [0, 15, -15, 0],
            duration: 800,
            easing: 'easeInOutElastic(1, .5)'
        });

        // Flash progress bar
        anime({
            targets: progressBarRef.current,
            backgroundColor: [
                { value: '#EF4444', duration: 200 },
                { value: '#DC2626', duration: 200 },
                { value: '#EF4444', duration: 200 }
            ],
            easing: 'easeInOutQuad'
        });

        // Warning text animation
        anime({
            targets: warningTextRef.current,
            scale: [1, 1.1, 1],
            color: ['#EF4444', '#DC2626', '#EF4444'],
            duration: 1000,
            easing: 'easeInOutQuad'
        });

        // Create danger particles
        createDangerParticles();
    };

    const createDangerParticles = () => {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.inset = '0';
        container.style.pointerEvents = 'none';
        container.style.overflow = 'hidden';
        cardRef.current.appendChild(container);

        const particles = Array.from({ length: 20 }, () => {
            const particle = document.createElement('div');
            particle.className = 'warning-particle';
            particle.style.position = 'absolute';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.backgroundColor = '#EF4444';
            particle.style.borderRadius = '50%';
            container.appendChild(particle);
            return particle;
        });

        anime({
            targets: particles,
            translateX: () => anime.random(-100, 100),
            translateY: () => anime.random(-100, 100),
            scale: [1, 0],
            opacity: [1, 0],
            duration: () => anime.random(1000, 1500),
            easing: 'easeOutExpo',
            complete: () => container.remove()
        });
    };

    useEffect(() => {
        if (!isInitialLoad && isOverBudget) {
            playOverBudgetAnimation();
        }
    }, [isOverBudget]);

    // Value change animation
    useEffect(() => {
        if (!isInitialLoad && totalSpent !== prevTotalSpent) {
            const timeline = anime.timeline();

            // Dramatic animation for negative or over-budget changes
            if (remaining < 0 || totalSpent > monthlyBudget) {
                timeline
                    .add({
                        targets: cardRef.current,
                        keyframes: [
                            { scale: 1 },
                            { scale: 1.02 },
                            { scale: 1 }
                        ],
                        duration: 400,
                        easing: 'easeOutElastic(1, .8)'
                    })
                    .add({
                        targets: progressBarRef.current,
                        width: `100%`,
                        backgroundColor: '#EF4444',
                        duration: 600,
                        easing: 'easeOutExpo'
                    }, '-=200');

                // Create warning flash effect
                const flash = document.createElement('div');
                flash.className = 'warning-flash';
                cardRef.current.appendChild(flash);

                anime({
                    targets: flash,
                    opacity: [0.5, 0],
                    duration: 600,
                    easing: 'easeOutExpo',
                    complete: () => flash.remove()
                });
            }

            // Normal value change animation
            anime({
                targets: [totalSpentRef.current, remainingRef.current],
                scale: [1, 1.05, 1],
                duration: 400,
                easing: 'easeOutBack'
            });
        }

        setPrevTotalSpent(totalSpent);
        setPrevRemaining(remaining);
    }, [totalSpent, remaining]);

    return (
        <Card
            ref={cardRef}
            className={`transform transition-all duration-300 relative overflow-hidden
        ${isOverBudget ? 'border-red-500 shadow-red-500/50 shadow-lg' : 'hover:shadow-lg'}`}
        >
            <CardHeader>
                <CardTitle ref={titleRef} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Wallet className={`w-6 h-6 ${isOverBudget ? 'text-red-500 animate-bounce' : 'text-blue-500'}`} />
                        <span>{isOverBudget ? 'Peringatan Anggaran!' : 'Status Anggaran'}</span>
                    </div>
                    {isOverBudget && (
                        <div className="flex items-center space-x-2">
                            <BellRing className="w-6 h-6 text-red-500 animate-ring" />
                            <AlertTriangle
                                ref={warningIconRef}
                                className="w-6 h-6 text-red-500 animate-pulse"
                            />
                        </div>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between">
                        <div className={`mb-4 sm:mb-0 transform transition-all duration-300 ${isOverBudget ? 'scale-105' : 'hover:scale-105'}`}>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className={`w-5 h-5 ${isOverBudget ? 'text-red-500' : 'text-blue-500'}`} />
                                <p className="text-sm text-gray-500">Terpakai</p>
                            </div>
                            <p ref={totalSpentRef} className={`text-xl sm:text-2xl font-bold ${isOverBudget ? 'text-red-500' : ''}`}>
                                {formatCurrency(totalSpent)}
                            </p>
                        </div>
                        <div className={`transform transition-all duration-300 ${isOverBudget ? 'scale-105' : 'hover:scale-105'}`}>
                            <div className="flex items-center space-x-2">
                                <TrendingDown className={`w-5 h-5 ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`} />
                                <p className="text-sm text-gray-500">Sisa</p>
                            </div>
                            <p ref={remainingRef} className={`text-xl sm:text-2xl font-bold ${remaining < 0 ? 'text-red-500' : ''}`}>
                                {formatCurrency(remaining)}
                            </p>
                        </div>
                    </div>

                    {isOverBudget && (
                        <div
                            ref={warningTextRef}
                            className="text-red-500 font-medium text-center animate-pulse"
                        >
                            ⚠️ Anda telah melampaui batas anggaran bulanan! ⚠️
                        </div>
                    )}

                    <div className="space-y-2">
                        <div ref={progressWrapperRef} className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                ref={progressBarRef}
                                className={`h-full rounded-full transition-all duration-500 relative
                  ${isOverBudget
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse'
                                        : getProgressColor(totalSpent, monthlyBudget)}`
                                }
                                style={{
                                    width: `${Math.min((totalSpent / monthlyBudget) * 100, 100)}%`,
                                }}
                            >
                                {isOverBudget && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-warning-shine" />
                                )}
                            </div>
                        </div>
                        <p className={`text-sm ${isOverBudget ? 'text-red-500 font-medium' : 'text-gray-500'} text-right`}>
                            {isOverBudget
                                ? '⚠️ Melebihi batas anggaran!'
                                : `${Math.min(Math.round((totalSpent / monthlyBudget) * 100), 100)}% terpakai`
                            }
                        </p>
                    </div>
                </div>
            </CardContent>

            <style jsx>{`
        @keyframes warning-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes ring {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }

        .animate-warning-shine {
          animation: warning-shine 1.5s infinite;
        }

        .animate-ring {
          animation: ring 0.5s infinite;
        }

        .warning-flash {
          position: absolute;
          inset: 0;
          background-color: #EF4444;
          pointer-events: none;
        }

        .warning-particle {
          position: absolute;
          pointer-events: none;
        }
      `}</style>
        </Card>
    );
};

const getProgressColor = (totalSpent, monthlyBudget) => {
    const percentage = (totalSpent / monthlyBudget) * 100;
    if (percentage >= 90) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    if (percentage >= 70) return 'bg-gradient-to-r from-blue-400 to-blue-500';
    return 'bg-gradient-to-r from-green-400 to-green-500';
};

export default BudgetStatus;