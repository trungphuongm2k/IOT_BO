// <---- import lb ---->
import classNames from 'classnames/bind';
// <---- import file ---->
import styles from './404page.module.scss';
const cx = classNames.bind(styles);
export default function Custom404() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('main')}>
                <img src='/404page.webp' alt='background 404' />
            </div>
        </div>
    );
}
