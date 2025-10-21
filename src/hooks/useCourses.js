import { useCoursesStore } from "../store/useCoursesStore";
export function useCourses() {
const {
items,
isLoading,
error,
fetch,
create,
update,
remove,
} = useCoursesStore();

const getById = (id) => items.find((x) => String(x.id) === String(id));

return {
items,
isLoading,
error,
fetch,
create,
update,
remove,
getById,
};
}