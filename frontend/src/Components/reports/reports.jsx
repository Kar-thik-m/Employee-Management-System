import { GetAllTask } from "../../Redux/Action/TaskAction";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const Reports = () => {
    const { task, loading, error } = useSelector((state) => state?.tasks);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(GetAllTask());
    }, [dispatch]);
    console.log(task)
    return (
        <>
            <div>
                reports
            </div>
        </>
    )
}
export default Reports;