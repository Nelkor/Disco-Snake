import createMove from './steering.js';
import create3DView from './3dView.js';
import create2DPainter from './2dView.js';

import { overlapPoints } from './geometry.js';

const side = 20;
const size = side * side;

const pointPosition = p => p[0] + p[1] * side;

export const start = (canvas3d, canvas2d, tps) => {
    const timeout = 1000 / tps;
    const startOffset = Math.floor(side / 2);

    const startHead = [startOffset, startOffset];
    const startFood = [startOffset + 1, startOffset];

    const state = {
        snake: [startHead],
        food: {
            point: startFood,
            createdAt: 0,
        },
    };

    const rndFood = () => {
        const vacancies = [];

        for (let i = 0; i < size; i++)
            if (!state.snake.some(p => pointPosition(p) == i))
                vacancies.push(i);

        if (!vacancies.length) return;

        const index = Math.floor(Math.random() * vacancies.length);

        state.food.point[0] = vacancies[index] % side;
        state.food.point[1] = Math.floor(vacancies[index] / side);

        state.food.createdAt = Date.now();
    };

    const move = createMove(side);
    const paint2D = create2DPainter(canvas2d, side);

    const tick = () => {
        const head = move(state.snake[0]);

        if (overlapPoints(head, state.food.point)) rndFood();
        else state.snake.pop();

        const collision = state.snake.findIndex(p => overlapPoints(p, head));

        if (collision > 2) state.snake.length = collision;

        state.snake.unshift(head);

        paint2D(state);

        if (state.snake.length < size) setTimeout(tick, timeout);
    };

    tick();
    create3DView(canvas3d, state, side);
};
