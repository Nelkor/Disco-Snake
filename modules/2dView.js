import { overlapPoints } from './geometry.js';

export default (canvas, side) => {
    const cell = 20;
    const resolution = side * cell;

    canvas.width = resolution;
    canvas.height = resolution;

    const ctx = canvas.getContext('2d');

    const createDraw = color => {
        return (x, y) => {
            ctx.fillStyle = color;

            x = x * cell + cell / 2;
            y = y * cell + cell / 2;

            ctx.beginPath();
            ctx.arc(x, y, cell / 3, 0, Math.PI * 2);
            ctx.fill();
        };
    };

    const drawEmpty = createDraw('rgba(255, 255, 255, .05)');
    const drawSnake = createDraw('rgb(255, 255, 255)');
    const drawFood = createDraw('rgb(255, 0, 0)');

    return state => {
        ctx.clearRect(0, 0, resolution, resolution);

        for (let i = 0; i < side; i++)
            for (let j = 0; j < side; j++) {
                if (overlapPoints([i, j], state.food.point)) {
                    drawFood(i, j);

                    continue;
                }

                if (state.snake.some(p => overlapPoints([i, j], p))) {
                    drawSnake(i, j);

                    continue;
                }

                drawEmpty(i, j);
            }
    };
};
