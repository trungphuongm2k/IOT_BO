import classNames from 'classnames/bind';
import styles from './Welcome.module.scss';
const cx = classNames.bind(styles);

function Welcome({ title }: { title: string }) {
    return (
        <div className={cx('wrapper')}>
            <section className={cx('header')}>
                <div className={cx('title-wrapper')}>
                    <h1 className={cx('sweet-title')}>
                        <span data-text='VAIV'>VAIV</span>
                        <span data-text='- BO'>- BO</span>
                    </h1>
                    <span className={cx('top-title')}>Chào mừng bạn đến với</span>
                </div>
            </section>
            <main>
                <div className={cx('main-img')}>
                    <div>
                        <img className=' object-contain' src='/welcome.svg' alt='welcome' />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Welcome;
