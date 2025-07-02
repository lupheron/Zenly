import React, { useState, useCallback, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import Cropper from 'react-easy-crop';
import ButtonDefault from '../../Button/ButtonDefault';
import { cropImage } from '@/src/utils/cropImage';
import { Area } from 'react-easy-crop'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const ProfileImageUpload = ({ value, onChange }: { value: string; onChange: (img: string, file?: File) => void }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [showCropper, setShowCropper] = useState<boolean>(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (value) {
            setFileList([{
                uid: '-1',
                name: 'profile.jpg',
                status: 'done',
                url: value,
            }]);
        }
    }, [value]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const beforeUpload = (file: FileType) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
        return false;
    };

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        const croppedImage = await cropImage(imageSrc, croppedAreaPixels);

        const blob = await fetch(croppedImage).then(res => res.blob());
        const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

        onChange(croppedImage, file);
        setFileList([{
            uid: '-1',
            name: 'profile.jpg',
            status: 'done',
            url: croppedImage,
        }]);
        setShowCropper(false);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-4">
            <Upload
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                showUploadList={{ showPreviewIcon: true }}
                accept="image/*"
                className="!w-[280px] !h-[280px]"
                style={{ width: 280, height: 280 }}
            >
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>

            <style>
                {`
                    .ant-upload-list-picture-circle .ant-upload-list-item,
                    .ant-upload-list-picture-circle .ant-upload-list-item-thumbnail,
                    .ant-upload-list-picture-circle .ant-upload-list-item-thumbnail img {
                        width: 280px !important;
                        height: 280px !important;
                        object-fit: cover;
                        border-radius: 50%;
                    }
                `}
            </style>

            {showCropper && imageSrc && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative w-[400px] h-[450px] bg-white rounded-lg p-4 flex flex-col gap-4">
                        <div className="relative w-full h-[350px]">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                cropShape="round"
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <ButtonDefault label="Saqlash" onClick={getCroppedImage} type="button" />
                        <ButtonDefault
                            label="Bekor qilish"
                            onClick={() => setShowCropper(false)}
                            customClasses="!bg-gray-300 !text-black"
                            type="button"
                        />
                    </div>
                </div>
            )}

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </div>
    );
};

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export default ProfileImageUpload;