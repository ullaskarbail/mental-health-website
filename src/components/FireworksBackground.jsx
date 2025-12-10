import React, { useEffect, useRef } from 'react';

const FireworksBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let fireworks = [];
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Firework {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height;
                this.sx = Math.random() * 3 - 1.5;
                this.sy = -(Math.random() * 4 + 4);
                this.size = Math.random() * 2 + 1;
                this.hue = Math.floor(Math.random() * 360);
                this.shouldExplode = false;
            }

            update() {
                this.x += this.sx;
                this.y += this.sy;
                this.sy += 0.05; // Gravity

                if (this.sy >= -2 || this.y <= 100 || this.x <= 0 || this.x >= canvas.width) {
                    this.shouldExplode = true;
                }
            }

            draw() {
                ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class Particle {
            constructor(x, y, hue) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 6 - 3;
                this.speedY = Math.random() * 6 - 3;
                this.hue = hue;
                this.life = 100;
                this.alpha = 1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.speedY += 0.05; // Gravity
                this.life -= 1;
                this.alpha -= 0.01;
            }

            draw() {
                ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Create new fireworks randomly
            if (Math.random() < 0.05) {
                fireworks.push(new Firework());
            }

            // Update and draw fireworks
            for (let i = fireworks.length - 1; i >= 0; i--) {
                fireworks[i].update();
                fireworks[i].draw();

                if (fireworks[i].shouldExplode) {
                    // Create particles
                    for (let j = 0; j < 50; j++) {
                        particles.push(new Particle(fireworks[i].x, fireworks[i].y, fireworks[i].hue));
                    }
                    fireworks.splice(i, 1);
                }
            }

            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();

                if (particles[i].life <= 0) {
                    particles.splice(i, 1);
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

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
                background: '#000' // Dark background for fireworks
            }}
        />
    );
};

export default FireworksBackground;
