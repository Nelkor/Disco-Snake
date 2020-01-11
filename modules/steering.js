const keys = [
    {
        codes: [
            'KeyW',
            'KeyK',
            'ArrowUp',
        ],
        fn: point => [point[0], point[1] - 1],
        role: 'vertical',
    },
    {
        codes: [
            'KeyA',
            'KeyH',
            'ArrowLeft',
        ],
        fn: point => [point[0] - 1, point[1]],
        role: 'horizontal',
    },
    {
        codes: [
            'KeyS',
            'KeyJ',
            'ArrowDown',
        ],
        fn: point => [point[0], point[1] + 1],
        role: 'vertical',
    },
    {
        codes: [
            'KeyD',
            'KeyL',
            'ArrowRight',
        ],
        fn: point => [point[0] + 1, point[1]],
        role: 'horizontal',
    },
];

export default side => {
    let direction = null;
    let prevRole = null;

    const onKeyDown = e => {
        const key = keys.find(k => k.codes.some(c => c == e.code));
    
        if (!key || key.role == prevRole) return;
    
        direction = key;
    };

    const normalize = n => {
        if (n < 0) return side - 1;
        if (n >= side) return 0;

        return n;
    };

    document.addEventListener('keydown', onKeyDown);

    return head => {
        if (!direction) return head;

        prevRole = direction.role;

        return direction.fn(head).map(normalize);
    };
};
