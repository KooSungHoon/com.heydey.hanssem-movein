export function getTabImage(name) {
    let path = '';
    switch (name) {
        case '거실a':
            path = '/movein/common/sub_tabs/3dep_tab1_off.jpg';
            break;
        case '거실b':
            path = '/movein/common/sub_tabs/3dep_tab2_off.jpg';
            break;
        case '주방':
            path = '/movein/common/sub_tabs/3dep_tab3_off.jpg';
            break;
        case '침실a':
            path = '/movein/common/sub_tabs/3dep_tab4_off.jpg';
            break;
        case '침실b':
            path = '/movein/common/sub_tabs/3dep_tab5_off.jpg';
            break;
        case '서재a':
            path = '/movein/common/sub_tabs/3dep_tab12_off.jpg';
            break;
        case '서재b':
            path = '/movein/common/sub_tabs/3dep_tab13_off.jpg';
            break;
        case '서재':
            path = '/movein/common/sub_tabs/3dep_tab9_off.jpg';
            break;
        case '자녀방':
            path = '/movein/common/sub_tabs/3dep_tab11_off.jpg';
            break;
        case '자녀방a':
            path = '/movein/common/sub_tabs/3dep_tab6_off.jpg';
            break;
        case '자녀방b':
            path = '/movein/common/sub_tabs/3dep_tab7_off.jpg';
            break;
        case '자녀방2':
            path = '/movein/common/sub_tabs/3dep_tab7_off.jpg';
            break;
        case '특가상품':
            path ='/movein/common/sub_tabs/3dep_tab10_off.jpg';
            break;
        default:
            path ='/movein/common/sub_tabs/3dep_tab14_off.jpg';
    }
    return path;
};


export function getWayImage(name) {
    let path = '';
    switch (name) {
        case 'bus':
            path = '/movein/common/way/bus.jpg';
            break;
        case 'subway':
            path = '/movein/common/way/subway.jpg';
            break;
    }
    return path;
};
