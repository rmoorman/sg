import isGenerator from './utils/isGenerator';
import callEffect from './effects/call';
import cpsEffect from './effects/cps';
import thunkEffect from './effects/thunk';
import coEffect from './effects/co';

function sg(generator) {
    if (!isGenerator(generator)) {
        throw new Error('sg need a generator function');
    }
    return (...args) => {
        const iterator = generator(...args);
        return new Promise((resolve, reject) => {
            function loop(next) {
                if (next.done) {
                    return resolve(next.value);
                }
                const effect = next.value;
                try {
                    return effect.handle()
                    .then(result => loop(iterator.next(result)))
                    .catch(error => loop(iterator.throw(error)));
                } catch (error) {
                    return reject(error);
                }
            }

            loop(iterator.next());
        });
    };
}

sg.call = callEffect;
sg.cps = cpsEffect;
sg.thunk = thunkEffect;
sg.co = coEffect;

export default sg;
