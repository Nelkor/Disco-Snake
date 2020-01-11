const boxLambert = (geometry, color) => {
    const boxGeometry = new THREE.BoxGeometry(...geometry);
    const material = new THREE.MeshLambertMaterial({ color });

    return new THREE.Mesh(boxGeometry, material);
};

const createLights = side => {
    const lights = [
        new THREE.PointLight(0xff4444),
        new THREE.PointLight(0x44ff44),
        new THREE.PointLight(0x4444ff),
    ];

    const group = new THREE.Group;

    const angle = 2 * Math.PI / lights.length;

    const setup = (obj, index) => {
        const x = side * Math.cos(angle * index);
        const z = side * Math.sin(angle * index);

        obj.position.set(x, side / 2, z);

        group.add(obj);
    };

    lights.forEach(setup);

    return group;
};

export default (canvas, state, side) => {
    const rendererParams = {
        antialias: true,
        canvas,
    };

    const snake = [];
    const normalizer = side / 2 - .5;

    const scene = new THREE.Scene;
    const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    const renderer = new THREE.WebGLRenderer(rendererParams);

    const snakeGeometry = new THREE.BoxGeometry(.95, .95, .95);
    const snakeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

    camera.position.z = side;
    camera.rotation.x = -Math.PI / 4;

    renderer.setClearColor('#011627');

    const board = boxLambert([side, .95, side], 0xeeeeee);
    const food = boxLambert([.95, .95, .95], 0xff5577);

    board.position.y = -1;

    const lights = createLights(side);

    scene.add(board);
    scene.add(food);
    scene.add(lights);

    const animationState = {
        cameraOffset: 0,
        cameraRises: true,
    };

    const step = .002;

    const animate = () => {
        lights.rotation.y += Math.PI / 360;

        if (animationState.cameraRises) {
            animationState.cameraOffset += step;

            if (animationState.cameraOffset > 3)
                animationState.cameraRises = false;
        } else {
            animationState.cameraOffset -= step;

            if (animationState.cameraOffset < 0)
                animationState.cameraRises = true;
        }

        setTimeout(animate, 10);
    };

    const resize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        renderer.setSize(width, height, false);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    const render = () => { // TODO экспортировать эту функцию, вызывать снаружи
        requestAnimationFrame(render);

        // food
        const time = Date.now() - state.food.createdAt;

        if (time < 100) {
            const scale = time / 100;

            food.scale.set(scale, scale, scale);
        } else food.scale.set(1, 1, 1);

        const [foodX, foodZ] = state.food.point;

        food.position.x = foodX - normalizer;
        food.position.z = foodZ - normalizer;

        // snake
        // 1. Довести массив мешей snake до длины state.snake
        let dif = state.snake.length - snake.length;

        while (dif > 0) {
            const mesh = new THREE.Mesh(snakeGeometry, snakeMaterial);

            snake.push(mesh);
            scene.add(mesh);

            dif--;
        }

        while (dif < 0) {
            const mesh = snake.pop();

            scene.remove(mesh);

            dif++;
        }

        // 2. Расположить xz мешей как в state.snake
        const setup = (mesh, index) => {
            const [x, z] = state.snake[index];

            mesh.position.x = x - normalizer;
            mesh.position.z = z - normalizer;
        };

        snake.forEach(setup);

        // camera
        camera.position.y = side - animationState.cameraOffset;

        renderer.render(scene, camera);
    };

    resize();
    animate();
    render();

    window.addEventListener('resize', resize);
};
