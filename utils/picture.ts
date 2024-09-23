import EnumPictureSizes from '~/Enums/EnumPictureSizes'

export const getDesiredHeightAndWidth = (image: HTMLImageElement) => {
    const aspectRatio = Math.min(
        image.height / image.width,
        image.width / image.height,
    )
    if (image.width > image.height) {
        return EnumPictureSizes.NUMBER_ARRAY.map((size) => {
            return [size, size * aspectRatio]
        })
    } else {
        return EnumPictureSizes.NUMBER_ARRAY.map((size) => {
            return [size * aspectRatio, size]
        })
    }
}

export const getConvertedPictureFiles = async (file: File) => {
    const rawImage = new Image()

    rawImage.src = URL.createObjectURL(file)

    await rawImage.decode()

    const sizes = getDesiredHeightAndWidth(rawImage)

    const resizedBlobs = await Promise.all(
        sizes.map(async ([width, height]) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = width
            canvas.height = height
            ctx?.drawImage(rawImage, 0, 0, width, height)
            return new Promise<Blob | null>((resolve, reject) => {
                return canvas.toBlob((blob: Blob | null) => {
                    if (!blob) {
                        reject('Error creating blob!')
                    }
                    resolve(blob)
                }, EnumPictureSizes.PREFFERED_TYPE)
            })
        }),
    )

    URL.revokeObjectURL(rawImage?.src)

    return Promise.all(
        resizedBlobs.map((blob, i) => {
            const [name] = file.name.split('.')
            const size = EnumPictureSizes.TEXT_ARRAY[i]
            const fileName = `${name.replace(/\s/g, '')}_${size}.webp`

            return {
                file: blob ? new File([blob], fileName) : null,
                size: size,
                sizeName: EnumPictureSizes.SIZE_NAMES[size],
                name: fileName,
                type: EnumPictureSizes.PREFFERED_TYPE,
            } as IPicture
        }),
    )
}
