set -e 

cd dashboard
nohup npm start &

cd ../backend
nohup python app&