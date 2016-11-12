'use script';

module.exports = function Info(app, component) {

	component.addRenderLocals('node_version', window.process.versions.node);
	component.addRenderLocals('chrome_version', window.process.versions.chrome);
	component.addRenderLocals('electron_version', window.process.versions.electron);
};
