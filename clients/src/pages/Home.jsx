import Beranda from '../components/Beranda'
import Layanan from '../components/Layanan'
import Tentang from "../components/Tentang";
import Kontak from "../components/Kontak";
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <>
            <Beranda />
            <Layanan />
            <Tentang />
            <Kontak />
            <Gallery />
            <Footer />
        </>
    )
}

export default Home