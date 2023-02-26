pipeline{
    agent any

    stages{
        stage('docker build'){
            steps{
                script{
                    sh "docker build -t registry.boxofcodes.com/observatorio_api:26512-${BUILD_ID}  ."
                }
            }
        }
        stage('docker push'){
            steps{
                script{
                    sh "docker push registry.boxofcodes.com/observatorio_api:26512-${BUILD_ID} "
                    sh "echo registry.boxofcodes.com/observatorio_api:26512-${BUILD_ID} "
                }
            }
        }
    }
}
