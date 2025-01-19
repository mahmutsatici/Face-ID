const video = document.getElementById('camera');
    const canvas = document.getElementById('snapshot');
    const context = canvas.getContext('2d');
    const imageInput = document.getElementById('image');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => video.srcObject = stream)
        .catch(err => console.error('Kameraya erişim sağlanamadı:', err));

    function capture() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
            const file = new File([blob], 'snapshot.jpg', { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageInput.files = dataTransfer.files;
            alert("Fotoğraf çekildi!");
        });
    }