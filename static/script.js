document.getElementById('start-camera').addEventListener('click', () => {
    const camera = document.getElementById('camera');
    const snapshot = document.getElementById('snapshot');
    const checkFace = document.getElementById('check-face');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            camera.srcObject = stream;
            camera.style.display = 'block';
            checkFace.style.display = 'inline';
        });
});

document.getElementById('check-face').addEventListener('click', () => {
    const camera = document.getElementById('camera');
    const snapshot = document.getElementById('snapshot');
    const context = snapshot.getContext('2d');
    snapshot.width = camera.videoWidth;
    snapshot.height = camera.videoHeight;
    context.drawImage(camera, 0, 0, snapshot.width, snapshot.height);
    snapshot.toBlob(blob => {
        const formData = new FormData();
        formData.append('image', blob);
        fetch('/recognize', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = `/home/${data.name}`;
            } else {
                alert('Yüz tanınamadı!');
            }
        });
    });
});
