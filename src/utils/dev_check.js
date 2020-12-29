/**
 * a
 */
Object.defineProperty(document, 'cookie', {
    set: function () {
        throw new Error('请不要写入cookie，可使用localstorage作为替代方案');
    },
    get: function (c) {}
});