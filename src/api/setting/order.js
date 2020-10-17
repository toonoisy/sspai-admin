import request from '../../utils/request';
export default {
    //获取数据
    getSeetingList() {
        return request.get('http://localhost:3000/user');
    },
    //添加数据
    addOrUpdate(trademark) {
        if (trademark.id) {
            return request.patch(`http://localhost:3000/user/${trademark.id}`, trademark);
        } else {
            return request.post('http://localhost:3000/user', trademark);
        }
    },
    //修改数据
    //删除数据
    deleteMon(id) {
        return request.delete(`http://localhost:3000/user/${id}`);
    }
};
