import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentInput, setCurrentPage, setLoading} from "../redux/searchSlice";
import { resetCityState } from '../redux/cityWeatherSlice';
import { resetTownshipState } from '../redux/townshipWeatherSlice';

const useSearch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSearch = (input) => {
        if (!input) {
            alert("Please enter any keywords to search!");
        } else {
            dispatch(setCurrentInput(input));
            dispatch(setCurrentPage(1));
            dispatch(setLoading(true));
            dispatch(resetCityState());
            dispatch(resetTownshipState());
            navigate("/newspage");
        }
    };

    return { handleSearch };
};

export default useSearch;
