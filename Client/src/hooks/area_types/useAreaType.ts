import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AlertDefault from '@/src/components/Alert/AlertDefault';
import api from '@/src/utils/axios';

export interface AreaType {
  id: number;
  name: string;
}

export interface CreateAreaTypePayload {
  name: string;
}

export interface UpdateAreaTypePayload {
  name: string;
}

// Fetch all area types
const fetchAreaTypes = async (): Promise<AreaType[]> => {
  try {
    const res = await api.get<{ data: AreaType[] }>('/area-types');
    return res.data.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string } } };
      AlertDefault.error(err.response?.data?.message || 'Area turlarini olishda xatolik yuz berdi.');
      throw new Error(err.response?.data?.message || 'Area turlarini olishda xatolik yuz berdi.');
    }
    AlertDefault.error('Area turlarini olishda xatolik yuz berdi.');
    throw new Error('Area turlarini olishda xatolik yuz berdi.');
  }
};

// Create area type
const createAreaType = async (data: CreateAreaTypePayload): Promise<AreaType> => {
  try {
    const res = await api.post<{ data: AreaType }>('/area-types', data);
    return res.data.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string } } };
      AlertDefault.error(err.response?.data?.message || 'Area turini yaratishda xatolik yuz berdi.');
      throw new Error(err.response?.data?.message || 'Area turini yaratishda xatolik yuz berdi.');
    }
    AlertDefault.error('Area turini yaratishda xatolik yuz berdi.');
    throw new Error('Area turini yaratishda xatolik yuz berdi.');
  }
};

// Update area type
const updateAreaType = async ({ id, data }: { id: number; data: UpdateAreaTypePayload }): Promise<AreaType> => {
  try {
    const res = await api.put<{ data: AreaType }>(`/area-types/${id}`, data);
    return res.data.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string } } };
      AlertDefault.error(err.response?.data?.message || 'Area turini yangilashda xatolik yuz berdi.');
      throw new Error(err.response?.data?.message || 'Area turini yangilashda xatolik yuz berdi.');
    }
    AlertDefault.error('Area turini yangilashda xatolik yuz berdi.');
    throw new Error('Area turini yangilashda xatolik yuz berdi.');
  }
};

export const useAreaTypes = () => {
  const queryClient = useQueryClient();

  const query = useQuery<AreaType[]>({
    queryKey: ['area-types'],
    queryFn: fetchAreaTypes,
    retry: 2,
  });

  const createMutation = useMutation<AreaType, Error, CreateAreaTypePayload>({
    mutationFn: createAreaType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['area-types'] });
      AlertDefault.success('Area turi yaratildi.');
    },
  });

  const updateMutation = useMutation<AreaType, Error, { id: number; data: UpdateAreaTypePayload }>({
    mutationFn: updateAreaType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['area-types'] });
      AlertDefault.success('Area turi yangilandi.');
    },
  });

  return {
    ...query,
    createAreaType: createMutation,
    updateAreaType: updateMutation,
  };
};
