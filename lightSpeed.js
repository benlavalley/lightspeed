/*
When executed via a server-side route in Meteor, this will defer loading the automatically injected Javascript payload to the browser.onload event
*/
import { Inject } from 'meteor/meteorhacks:inject-initial';

const tempFunc = function () {
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = '/assets/foo.js';
	document.getElementsByTagName('body')[0].appendChild(script);
};
let convertedLoadFunc = tempFunc.toString();
convertedLoadFunc = convertedLoadFunc.replace('function tempFunc() {', '');
convertedLoadFunc = convertedLoadFunc.replace('}', '');
convertedLoadFunc = convertedLoadFunc.split('/assets/foo.js');
const lightSpeedOne = convertedLoadFunc[0];
const lightSpeedTwo = convertedLoadFunc[1];

export default function lightSpeed() {
	Inject.rawModHtml('lightSpeedJS', function (htmlVar) {
		let html = htmlVar;
		let scripts = html.match(/<script type="text\/javascript" src.*"><\/script>\n/g); // get all scripts
		if (scripts) {
			scripts = scripts.join('');
			let scriptReplace = scripts.replace(/<script type="text\/javascript" src="/g, lightSpeedOne);
			scriptReplace = scriptReplace.replace(/"><\/script>\n/g, lightSpeedTwo);
			html = html.replace(/<script type="text\/javascript" src.*"><\/script>\n/g, ''); // remove all scripts.
			html += `<script> window.onload = function () {${scriptReplace}};</script>`; // now replace with these!
		} else {
			console.log(`lightSpeed error: unable to find any scripts to process. htmlVar is : ${htmlVar}`);
		}
		return html.replace(/[\n]+/g, '\n').replace(/ +/g, ' ');
	});
}
