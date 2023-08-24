import { useState, useEffect } from 'react';
import Container from '../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useParams } from 'react-router-dom'

interface Props {
    rootStore: RootStore
}

const InspectClass: React.FC<Props> = ({ rootStore }) => {
    const [classStatus, setClassStatus] = useState(false)
    const [classUrl, setClassUrl] = useState('')
    const { authStore } = rootStore
    const { userLoginData } = authStore
    const params: any = useParams()
    const { class_name } = params

    useEffect(() => {
        getClassStream()
    }, [])

    const getClassStream = async () => {
        setTimeout(() => {
            const classUrl = `./../videoCall.html?v=1.0&name=${userLoginData.first_name}&email=${userLoginData.email}&roomName=${class_name}`
            setClassUrl(classUrl)
            setClassStatus(true)    
        }, 10);
        
    }
    
    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <div className="row justify-content-center mt-5">
            {
                classStatus === true && <div className="col-12">
                    <iframe 
                        className="videoCall custom-scroll iframe_size" 
                        src={classUrl}
                    ></iframe>
                </div>
            }
        </div>
    </Container>
}


export default InspectClass;