import { create } from "zustand";

const useLoginStore = create((set) => ({
    user: [],
}));

export default useLoginStore;