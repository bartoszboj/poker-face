/* eslint-disable @typescript-eslint/no-extraneous-class */
interface SizeNames {
    [key: string]: string
}

export default class EnumPictureSizes {
    static readonly THUMBNAIL = '128X128'
    static readonly THUMBNAIL_NUMBER = 128
    static readonly IMAGE = '320X320'
    static readonly IMAGE_NUMBER = 320
    static readonly ICON = '64X64'
    static readonly ICON_NUMBER = 64
    static readonly TEXT_ARRAY = [this.ICON, this.THUMBNAIL, this.IMAGE]
    static readonly NUMBER_ARRAY = [
        this.ICON_NUMBER,
        this.THUMBNAIL_NUMBER,
        this.IMAGE_NUMBER,
    ]
    static readonly PREFFERED_TYPE = 'image/webp'
    static readonly SIZE_NAMES: SizeNames = {
        [this.ICON]: 'icon',
        [this.THUMBNAIL]: 'thumbnail',
        [this.IMAGE]: 'image',
    }
}
