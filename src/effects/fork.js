import newTask from '../utils/newTask';
import createEffect from './createEffect';

export const handleForkEffectFactory = newTaskImpl => ([callable, ...args], emitter, id) =>
new Promise((resolve, reject) => {
    try {
        const task = newTaskImpl(callable, emitter, id)(...args);
        resolve(task);
    } catch (error) {
        reject(error);
    }
});

export const handleForkEffect = handleForkEffectFactory(newTask);

export default createEffect('fork', handleForkEffect);
