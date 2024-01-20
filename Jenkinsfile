pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'citas-hospital:1.0'
        K8S_NAMESPACE = 'default'
        K8S_DEPLOYMENT = 'citas-hospital-deployment'
        K8S_SERVICE = 'citas-hospital-service'
    }

    stages {
        stage('Checkout') {
            steps {
                // Paso para realizar checkout del código fuente
                checkout scm
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Construir y etiquetar la imagen de Docker
                    docker.build DOCKER_IMAGE
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Aplicar el manifiesto de implementación en Kubernetes
                    sh "kubectl apply -f deployment.yaml -n $K8S_NAMESPACE"
                    
                    // Esperar a que el despliegue esté listo
                    sh "kubectl rollout status deployment $K8S_DEPLOYMENT -n $K8S_NAMESPACE"
                    
                    // Aplicar el manifiesto del servicio en Kubernetes
                    sh "kubectl apply -f service.yaml -n $K8S_NAMESPACE"
                    
                    // Esperar a que el servicio esté listo
                    sh "kubectl rollout status service $K8S_SERVICE -n $K8S_NAMESPACE"
                }
            }
        }
    }

    post {
        always {
            // Limpia los recursos de Kubernetes (si es necesario)
            script {
                // Eliminar el despliegue y el servicio de Kubernetes
                sh "kubectl delete deployment $K8S_DEPLOYMENT -n $K8S_NAMESPACE"
                sh "kubectl delete service $K8S_SERVICE -n $K8S_NAMESPACE"
            }
        }

        success {
            script {
                // Acciones posteriores en caso de éxito
                echo "¡El pipeline se ejecutó con éxito!"
                slackSend(channel: '#canal-de-notificaciones', color: 'good', message: "¡El pipeline de Jenkins se ejecutó con éxito!")
            }
        }

        failure {
            script {
                // Acciones posteriores en caso de fallo
                echo "¡El pipeline falló!"

                // Notificar a los responsables por correo electrónico
                emailext body: "El pipeline de Jenkins ha fallado. Por favor, toma las medidas necesarias.",
                        subject: "¡Alerta de Jenkins! El pipeline ha fallado.",
                        to: "responsable@example.com"
            }
        }
    }
}
