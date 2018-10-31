import ajax from './ajax';

export default {
    getTaskList(data) {
        return ajax.post('/api/vmission/missionsnapshot/list', data)
    }
}
