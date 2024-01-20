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
                checkout scm
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Construye la imagen de Docker y la etiqueta
                    docker.build DOCKER_IMAGE
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Aplica el archivo de implementación en Kubernetes
                    sh "kubectl apply -f deployment.yaml -n $K8S_NAMESPACE"
                    
                    // Espera a que el despliegue esté listo
                    sh "kubectl rollout status deployment $K8S_DEPLOYMENT -n $K8S_NAMESPACE"
                    
                    // Aplica el archivo de servicio en Kubernetes
                    sh "kubectl apply -f service.yaml -n $K8S_NAMESPACE"
                    
                    // Espera a que el servicio esté listo
                    sh "kubectl rollout status service $K8S_SERVICE -n $K8S_NAMESPACE"
                }
            }
        }
    }

    post {
        always {
            // Limpia los recursos (si es necesario)
            script {
                // Eliminar el despliegue y el servicio de Kubernetes
                sh "kubectl delete deployment $K8S_DEPLOYMENT -n $K8S_NAMESPACE"
                sh "kubectl delete service $K8S_SERVICE -n $K8S_NAMESPACE"
                sh "kubectl delete configmap $K8S_CONFIG_MAP -n $K8S_NAMESPACE"
            }
        }

        success {
            script {
                // Puedes incluir pasos específicos para cuando el pipeline tiene éxito
                echo "¡El pipeline se ejecutó con éxito!"

                // Notificar el éxito a un canal de Slack
                slackSend(channel: '#canal-de-notificaciones', color: 'good', message: "¡El pipeline de Jenkins se ejecutó con éxito!")
            }
        }

        failure {
            script {
                // Puedes incluir pasos específicos para cuando el pipeline falla
                echo "¡El pipeline falló!"

                // Notificar a los responsables por correo electrónico
                emailext body: "El pipeline de Jenkins ha fallado. Por favor, toma las medidas necesarias.",
                        subject: "¡Alerta de Jenkins! El pipeline ha fallado.",
                        to: "responsable@example.com"
            }
        }
    }
}
