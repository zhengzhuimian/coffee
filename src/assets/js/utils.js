import { Toast } from 'vant';
class Utils {
    // 验证表单
    validForm(o) {
        for (let key in o) {
            if (!o[key].reg.test(o[key].value)) {
                Toast({
                    message: o[key].errorMsg,
                })
                return false
            }
        }

        return true;
    }
}

export const utils = new Utils()