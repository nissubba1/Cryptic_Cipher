'use strict';

// Defines the alphabet used by the ciphers.
const alphabetBank = 'abcdefghijklmnopqrstuvwxyz';
// Flag to determine which cipher is currently active: true for Caesar, false for Vigenère.
let caesarTypeCipher = true;

/**
 * Encrypts or decrypts text using the Caesar cipher method.
 * The Caesar cipher shifts each letter by a number of places down the alphabet.
 *
 * @param {string} text - The input text to encrypt or decrypt.
 * @param {number} shift - The number of positions to shift each letter.
 * @param {number} [direction=1] - The direction of the shift; 1 for encryption, -1 for decryption.
 * @returns {string} - The resulting text after applying the Caesar cipher.
 */
function caesarCipher(text, shift, direction = 1) {
	let finalMessage = '';
	let findIndex;
	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const isUpperCase = char === char.toUpperCase();
		// Convert character to lowercase and find its index in the alphabet
		findIndex = alphabetBank.indexOf(char.toLowerCase());
		if (findIndex === -1) {
			// Non-alphabetic characters are appended unchanged to the final message.
			finalMessage += char;
		} else {
			// Calculate the new index after applying the shift and direction
			let newIndex = (findIndex + shift * direction + alphabetBank.length) % alphabetBank.length;
			// Append the correctly cased character from the new index to the final message
			finalMessage += isUpperCase ? alphabetBank[newIndex].toUpperCase() : alphabetBank[newIndex];
		}
	}
	return finalMessage;
}

/**
 * Encrypts or decrypts text using the Vigenère cipher method.
 * The Vigenère cipher uses a keyword to determine the shift for each letter in the plaintext.
 *
 * @param {string} text - The text to encrypt or decrypt.
 * @param {string} key - The keyword used for determining the shift of each letter.
 * @param {number} [direction=1] - Direction of the shift; 1 for encryption, -1 for decryption.
 * @returns {string} - The encrypted or decrypted text.
 */
function vigenereCipher(text, key, direction = 1) {
	let finalMessage = '';
	let keyIndex = 0;
	let findIndex;

	// Validate the key before proceeding with encryption or decryption
	if (!key || key.length === 0 || !key.split('').every(char => alphabetBank.includes(char.toLowerCase()))) {
		console.error('Invalid key: key must only contain alphabetic characters and must not be empty');
		return text;  // Return the original text if the key is invalid.
	}

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const isUpperCase = char === char.toUpperCase();
		// Convert character to lowercase and find its index in the alphabet
		findIndex = alphabetBank.indexOf(char.toLowerCase());
		if (findIndex === -1) {
			// Append non-alphabetic characters unchanged to the final message
			finalMessage += char;
		} else {
			// Calculate the shift index from the key
			let newIndex = alphabetBank.indexOf(key[keyIndex % key.length].toLowerCase());
			keyIndex++;  // Increment key index for the next loop iteration
			// Compute final index considering the shift, direction, and wrap-around
			let finalIndex = (findIndex + newIndex * direction + alphabetBank.length) % alphabetBank.length;
			// Append the correctly cased character from the final index to the final message
			finalMessage += isUpperCase ? alphabetBank[finalIndex].toUpperCase() : alphabetBank[finalIndex];
		}
	}
	return finalMessage;
}

/**
 * Determines whether to encrypt text using the Caesar or Vigenère cipher based on caesarTypeCipher flag.
 *
 * @param {string} text - Text to be encrypted.
 * @param {string|number} keyOrShift - Either the shift amount for Caesar cipher or the keyword for Vigenère cipher.
 * @returns {string} - The encrypted text.
 */
function encryptText(text, keyOrShift) {
	// Choose the cipher type based on the caesarTypeCipher flag and encrypt the text
	return caesarTypeCipher ? caesarCipher(text, keyOrShift) : vigenereCipher(text, keyOrShift);
}

/**
 * Determines whether to decrypt text using the Caesar or Vigenère cipher based on caesarTypeCipher flag.
 *
 * @param {string} text - Text to be decrypted.
 * @param {string|number} keyOrShift - Either the shift amount for Caesar cipher or the keyword for Vigenère cipher.
 * @returns {string} - The decrypted text.
 */
function decryptText(text, keyOrShift) {
	// Choose the cipher type based on the caesarTypeCipher flag and decrypt the text
	return caesarTypeCipher ? caesarCipher(text, keyOrShift, -1) : vigenereCipher(text, keyOrShift, -1);
}

// Select HTML elements for displaying and interacting with the ciphers.
const textHolder = document.querySelector('.cipher-holder');
const changeText = document.querySelector('.name-cipher');
const caesarBtn = document.getElementById('caesar-cipher');
const vigenereBtn = document.getElementById('vigenere-cipher');
const hideVigenere = document.querySelector('.vigenere-section');
const hideCaesar = document.querySelector('.caesar-section');

// Event listener to activate Vigenère cipher and adjust the UI accordingly.
document.querySelector('#vigenere-cipher').addEventListener('click', function () {
	// Show Vigenère options and hide Caesar options.
	hideVigenere.classList.remove('hide');
	hideCaesar.classList.add('hide');
	// Update button styles to reflect active cipher.
	caesarBtn.classList.remove('active');
	vigenereBtn.classList.add('active');
	// Set flag to false to switch to Vigenère cipher.
	caesarTypeCipher = false;
})

// Event listener to activate Caesar cipher and adjust the UI accordingly.
document.querySelector('#caesar-cipher').addEventListener('click', function () {
	// Show Caesar options and hide Vigenère options.
	hideCaesar.classList.remove('hide');
	hideVigenere.classList.add('hide');
	// Update button styles to reflect active cipher.
	caesarBtn.classList.add('active');
	vigenereBtn.classList.remove('active');
	// Set flag to true to switch to Caesar cipher.
	caesarTypeCipher = true;
})

// Event listener for the encrypt button to perform encryption based on active cipher.
document.querySelector('#encrypt-btn').addEventListener('click', function () {
	// Read the shift/key value from the input fields.
	const shiftKey = document.getElementById('shift-key').value;
	const vigenereKey = document.getElementById('vigenere-key').value;
	const textMessage = document.querySelector('#caesar-text').value;
	// Display the state as 'Encrypted'.
	changeText.textContent = 'Encrypted';
	// Perform encryption and display the result.
	if (caesarTypeCipher) {
		textHolder.textContent = encryptText(textMessage, shiftKey);
	} else {
		textHolder.textContent = encryptText(textMessage, vigenereKey);
	}
})

// Event listener for the decrypt button to perform decryption based on active cipher.
document.querySelector('#decrypt-btn').addEventListener('click', function () {
	// Read the shift/key value from the input fields.
	const shiftKey = document.getElementById('shift-key').value;
	const vigenereKey = document.getElementById('vigenere-key').value;
	const textMessage = document.querySelector('#caesar-text').value;
	// Display the state as 'Decrypted'.
	changeText.textContent = 'Decrypted';
	// Perform decryption and display the result.
	if (caesarTypeCipher) {
		textHolder.textContent = decryptText(textMessage, shiftKey);
	} else {
		textHolder.textContent = decryptText(textMessage, vigenereKey);
	}
})
