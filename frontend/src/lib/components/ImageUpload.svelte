<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let currentImage: string = '';
	export let disabled: boolean = false;
	export let error: string = '';

	const dispatch = createEventDispatcher<{
		imageChange: string;
	}>();

	let uploading = false;
	let preview = currentImage;
	let fileInput: HTMLInputElement;

	// Update preview when currentImage changes
	$: preview = currentImage;

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		try {
			uploading = true;
			error = '';

			// Create FormData and upload to our API endpoint
			const formData = new FormData();
			formData.append('image', file);

			const response = await fetch('/api/upload-image', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to upload image');
			}

			const result = await response.json();
			preview = result.image;
			dispatch('imageChange', result.image);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to upload image';
			console.error('Image upload error:', err);
		} finally {
			uploading = false;
		}
	}

	function handleRemoveImage() {
		preview = '';
		dispatch('imageChange', '');
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function triggerFileInput() {
		fileInput?.click();
	}
</script>

<div class="image-upload-container">
	<label class="form-label">Profile Image (Optional)</label>

	<div class="upload-area">
		{#if preview}
			<div class="preview-container">
				<img src={preview} alt="Profile preview" class="preview-image" />
				<div class="preview-overlay">
					<button
						type="button"
						on:click={triggerFileInput}
						class="overlay-button change-button"
						{disabled}
					>
						Change
					</button>
					<button
						type="button"
						on:click={handleRemoveImage}
						class="overlay-button remove-button"
						{disabled}
					>
						Remove
					</button>
				</div>
			</div>
		{:else}
			<button
				type="button"
				on:click={triggerFileInput}
				class="upload-button"
				disabled={disabled || uploading}
			>
				<svg class="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<span class="upload-text">
					{uploading ? 'Processing...' : 'Click to upload image'}
				</span>
				<span class="upload-hint">JPEG, PNG, WebP or GIF (max 10MB)</span>
			</button>
		{/if}

		<input
			bind:this={fileInput}
			type="file"
			accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
			on:change={handleFileSelect}
			class="file-input"
			{disabled}
		/>
	</div>

	{#if uploading}
		<p class="info-message">Processing image (resizing to 300x300, converting to JPEG)...</p>
	{/if}

	{#if error}
		<p class="error-message">{error}</p>
	{/if}

	<p class="help-text">Image will be automatically resized to 300x300 pixels and converted to JPEG format.</p>
</div>

<style>
	.image-upload-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-label {
		font-weight: 500;
		color: #374151;
		font-size: 0.875rem;
	}

	.upload-area {
		position: relative;
		width: 100%;
		max-width: 300px;
	}

	.preview-container {
		position: relative;
		width: 300px;
		height: 300px;
		border-radius: 0.5rem;
		overflow: hidden;
		border: 2px solid #e5e7eb;
	}

	.preview-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.preview-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.preview-container:hover .preview-overlay {
		opacity: 1;
	}

	.overlay-button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.change-button {
		background-color: #3b82f6;
		color: white;
	}

	.change-button:hover {
		background-color: #2563eb;
	}

	.remove-button {
		background-color: #ef4444;
		color: white;
	}

	.remove-button:hover {
		background-color: #dc2626;
	}

	.overlay-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.upload-button {
		width: 300px;
		height: 300px;
		border: 2px dashed #d1d5db;
		border-radius: 0.5rem;
		background-color: #f9fafb;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem;
	}

	.upload-button:hover:not(:disabled) {
		border-color: #3b82f6;
		background-color: #eff6ff;
	}

	.upload-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.upload-icon {
		width: 3rem;
		height: 3rem;
		color: #9ca3af;
	}

	.upload-text {
		font-weight: 500;
		color: #374151;
		font-size: 0.875rem;
	}

	.upload-hint {
		font-size: 0.75rem;
		color: #6b7280;
		text-align: center;
	}

	.file-input {
		display: none;
	}

	.error-message {
		color: #ef4444;
		font-size: 0.875rem;
		margin: 0;
	}

	.info-message {
		color: #3b82f6;
		font-size: 0.875rem;
		margin: 0;
		font-style: italic;
	}

	.help-text {
		color: #6b7280;
		font-size: 0.75rem;
		margin: 0;
		font-style: italic;
	}
</style>
