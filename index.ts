import app from './src/app/app';

const PORT: number = parseInt(process.env.PORT || '8080');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
