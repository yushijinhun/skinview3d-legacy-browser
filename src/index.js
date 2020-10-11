import * as skinview3d from "skinview3d";

const skinParts = ["head", "body", "rightArm", "leftArm", "rightLeg", "leftLeg"];
const skinLayers = ["innerLayer", "outerLayer"];
const availableAnimations = {
	walk: skinview3d.WalkingAnimation,
	run: skinview3d.RunningAnimation,
	fly: skinview3d.FlyingAnimation
};

let skinViewer;
let orbitControl;
let rotateAnimation;
let primaryAnimation;

function reloadSkin() {
	const input = document.getElementById("skin_url");
	const url = input.value;
	if (url === "") {
		skinViewer.loadSkin(null);
		input.setCustomValidity("");
	} else {
		skinViewer.loadSkin(url, document.getElementById("skin_model").value)
			.then(() => input.setCustomValidity(""))
			.catch(e => {
				input.setCustomValidity("Image can't be loaded.");
				console.error(e);
			});
	}
}

function reloadCape() {
	const input = document.getElementById("cape_url");
	const url = input.value;
	if (url === "") {
		skinViewer.loadCape(null);
		input.setCustomValidity("");
	} else {
		const selectedBackEquipment = document.querySelector('input[type="radio"][name="back_equipment"]:checked');
		skinViewer.loadCape(url, { backEquipment: selectedBackEquipment.value })
			.then(() => input.setCustomValidity(""))
			.catch(e => {
				input.setCustomValidity("Image can't be loaded.");
				console.error(e);
			});
	}
}

function initializeControls() {
	document.getElementById("canvas_width").addEventListener("change", e => skinViewer.width = e.target.value);
	document.getElementById("canvas_height").addEventListener("change", e => skinViewer.height = e.target.value);
	document.getElementById("global_animation_speed").addEventListener("change", e => skinViewer.animations.speed = e.target.value);
	document.getElementById("animation_pause_resume").addEventListener("click", () => skinViewer.animations.paused = !skinViewer.animations.paused);
	document.getElementById("rotate_animation").addEventListener("change", e => {
		if (e.target.checked && rotateAnimation === null) {
			rotateAnimation = skinViewer.animations.add(skinview3d.RotatingAnimation);
			rotateAnimation.speed = document.getElementById("rotate_animation_speed").value;
		} else if (!e.target.checked && rotateAnimation !== null) {
			rotateAnimation.resetAndRemove();
			rotateAnimation = null;
		}
	});
	document.getElementById("rotate_animation_speed").addEventListener("change", e => {
		if (rotateAnimation !== null) {
			rotateAnimation.speed = e.target.value;
		}
	});
	for (const el of document.querySelectorAll('input[type="radio"][name="primary_animation"]')) {
		el.addEventListener("change", e => {
			if (primaryAnimation !== null) {
				primaryAnimation.resetAndRemove();
				primaryAnimation = null;
			}
			if (e.target.value !== "") {
				primaryAnimation = skinViewer.animations.add(availableAnimations[e.target.value]);
				primaryAnimation.speed = document.getElementById("primary_animation_speed").value;
			}
		});
	}
	document.getElementById("primary_animation_speed").addEventListener("change", e => {
		if (primaryAnimation !== null) {
			primaryAnimation.speed = e.target.value;
		}
	});
	document.getElementById("control_rotate").addEventListener("change", e => orbitControl.enableRotate = e.target.checked);
	document.getElementById("control_zoom").addEventListener("change", e => orbitControl.enableZoom = e.target.checked);
	document.getElementById("control_pan").addEventListener("change", e => orbitControl.enablePan = e.target.checked);
	for (const part of skinParts) {
		for (const layer of skinLayers) {
			document.querySelector(`#layers_table input[type="checkbox"][data-part="${part}"][data-layer="${layer}"]`)
				.addEventListener("change", e => skinViewer.playerObject.skin[part][layer].visible = e.target.checked);
		}
	}
	const skinReader = new FileReader();
	skinReader.addEventListener("load", e => {
		document.getElementById("skin_url").value = skinReader.result;
		reloadSkin();
	});
	document.getElementById("skin_url_upload").addEventListener("change", e => {
		const file = e.target.files[0];
		if (file !== undefined) {
			skinReader.readAsDataURL(file);
		}
	});
	const capeReader = new FileReader();
	capeReader.addEventListener("load", e => {
		document.getElementById("cape_url").value = capeReader.result;
		reloadCape();
	});
	document.getElementById("cape_url_upload").addEventListener("change", e => {
		const file = e.target.files[0];
		if (file !== undefined) {
			capeReader.readAsDataURL(file);
		}
	});
	document.getElementById("skin_url").addEventListener("change", () => reloadSkin());
	document.getElementById("skin_model").addEventListener("change", () => reloadSkin());
	document.getElementById("cape_url").addEventListener("change", () => reloadCape());

	for (const el of document.querySelectorAll('input[type="radio"][name="back_equipment"]')) {
		el.addEventListener("change", e => {
			if (skinViewer.playerObject.backEquipment === null) {
				// cape texture hasn't been loaded yet
				// this option will be processed on texture loading
			} else {
				skinViewer.playerObject.backEquipment = e.target.value;
			}
		});
	}

	document.getElementById("reset_all").addEventListener("click", () => {
		skinViewer.dispose();
		orbitControl.dispose();
		initializeViewer();
	});
}

function initializeViewer() {
	skinViewer = new skinview3d.FXAASkinViewer({
		canvas: document.getElementById("skin_container"),
		alpha: false
	});
	skinViewer.renderer.setClearColor(0x5a76f3);
	orbitControl = skinview3d.createOrbitControls(skinViewer);
	rotateAnimation = null;
	primaryAnimation = null;

	skinViewer.width = document.getElementById("canvas_width").value;
	skinViewer.height = document.getElementById("canvas_height").value;
	skinViewer.animations.speed = document.getElementById("global_animation_speed").value;
	if (document.getElementById("rotate_animation").checked) {
		rotateAnimation = skinViewer.animations.add(skinview3d.RotatingAnimation);
		rotateAnimation.speed = document.getElementById("rotate_animation_speed").value;
	}
	const primaryAnimationName = document.querySelector('input[type="radio"][name="primary_animation"]:checked').value;
	if (primaryAnimationName !== "") {
		primaryAnimation = skinViewer.animations.add(availableAnimations[primaryAnimationName]);
		primaryAnimation.speed = document.getElementById("primary_animation_speed").value;
	}
	orbitControl.enableRotate = document.getElementById("control_rotate").checked;
	orbitControl.enableZoom = document.getElementById("control_zoom").checked;
	orbitControl.enablePan = document.getElementById("control_pan").checked;
	for (const part of skinParts) {
		for (const layer of skinLayers) {
			skinViewer.playerObject.skin[part][layer].visible =
				document.querySelector(`#layers_table input[type="checkbox"][data-part="${part}"][data-layer="${layer}"]`).checked;
		}
	}
	reloadSkin();
	reloadCape();
}

initializeControls();
initializeViewer();
