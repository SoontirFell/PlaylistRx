const nest = (create, update, prop) => {
    const component = create(nestUpdate(update, prop));
    const result = Object.assign({}, component);
    if (component.model) {
        result.model = () => {
            const initialModel = {};
            initialModel[prop] = component.model();
            return initialModel;
        };
    }
    if (component.view) {
        result.view = (model) => component.view(model[prop])
    }
    return result;
};

const nestUpdate = (update, prop) => {
    return (func) => {
        update((model) => {
            model[prop] = func(model[prop]);
            return model;
        });
    };
};

export default nest;