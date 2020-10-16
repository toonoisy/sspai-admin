import request from '../utils/request';

export const getSeriesLatest = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};
