import React, { useEffect, useRef } from 'react';

const HoleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.angle = Math.random() * Math.PI * 2;
                this.radius = Math.random() * canvas.width + canvas.width / 4;
                this.speed = Math.random() * 2 + 1;
                this.size = Math.random() * 2 + 0.5;
                this.color = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`; // Blue/Purple hues
            }

            update() {
                this.radius -= this.speed;
                this.angle += this.speed / 200;
                
                // Spiral effect
                this.x = canvas.width / 2 + Math.cos(this.angle) * this.radius;
                this.y = canvas.height / 2 + Math.sin(this.angle) * this.radius;

                if (this.radius <= 0) {
                    this.reset();
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < 800; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw the "Hole" in the center
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow around the hole
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 30,
                canvas.width / 2, canvas.height / 2, 100
            );
            gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                background: '#000'
            }}
        />
    );
};

export default HoleBackground;
