pipeline {
    agent any

    stages {

        stage('Clean Old Containers') {
            steps {
                sh 'docker-compose down || true'
            }
        }

        stage('Build Docker Containers') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }

        stage('Verify Running') {
            steps {
                sh 'docker ps'
            }
        }
    }
}