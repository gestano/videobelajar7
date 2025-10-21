import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import * as api from "../services/api/courses";
const initialState = {
items: [],
isLoading: false,
error: null,
};

export const useCoursesStore = create(
devtools(
persist(
(set, get) => ({
...initialState,
 fetch: async (params) => {
      set({ isLoading: true, error: null });
      try {
        const data = await api.listCourses(params);
        set({ items: data, isLoading: false });
      } catch (err) {
        set({ error: err, isLoading: false });
      }
    },

    create: async (payload) => {
      const created = await api.createCourse(payload);
      set((state) => ({ items: [...state.items, created] }));
      return created;
    },

    update: async (id, payload) => {
      const updated = await api.updateCourse(id, payload);
      set((state) => ({
        items: state.items.map((it) =>
          String(it.id) === String(id) ? updated : it
        ),
      }));
      return updated;
    },

    remove: async (id) => {
      await api.deleteCourse(id);
      set((state) => ({
        items: state.items.filter((it) => String(it.id) !== String(id)),
      }));
    },

    reset: () => set(initialState),
  }),
  { name: "courses-store" }
)
)
);