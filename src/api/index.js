import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

// 获取数据
export const getTopicsList = () => {
    return request({
        url: 'http://localhost:3000/topicslist',
        method: 'get',
    });
};
//  添加和修改
export const addTopics = (topics) => {
    return request({
        url: 'http://localhost:3000/topicslist',
        method: 'post',
        data:topics
    });
};
//  获取对应id的话题
export const getTopicsOne = (id) => {
    return request({
        url: `http://localhost:3000/topicslist/${id}`,
        method: 'get',
    });
};

// 修改
export const updateTopics = (id,topics) => {
    return request({
        url: `http://localhost:3000/topicslist/${id}`,
        method: 'patch',
        data:topics
    });
};



//   删除
export const del = (id) => {
    return request({
        url: `http://localhost:3000/topicslist/${id}`,
        method: 'delete',
    });
};