import { useCallback, useEffect, useMemo, useState } from 'react'

interface UseSelectedPhotosArgs {
  photos: string[]
  poseTitles: string[]
}

export function useSelectedPhotos({ photos, poseTitles }: UseSelectedPhotosArgs) {
  const [selectedPhotoIndices, setSelectedPhotoIndices] = useState<number[]>([])

  useEffect(() => {
    setSelectedPhotoIndices(photos.map((_, index) => index))
  }, [photos])

  const outputPhotoIndices = useMemo(() => {
    if (selectedPhotoIndices.length === 0) {
      return photos.map((_, index) => index)
    }

    return selectedPhotoIndices
      .filter((index) => index >= 0 && index < photos.length)
      .sort((a, b) => a - b)
  }, [photos, selectedPhotoIndices])

  const outputPhotos = useMemo(
    () => outputPhotoIndices.map((index) => photos[index]).filter(Boolean),
    [outputPhotoIndices, photos],
  )

  const outputPoseTitles = useMemo(
    () => outputPhotoIndices.map((index) => poseTitles[index] ?? `Pose ${index + 1}`),
    [outputPhotoIndices, poseTitles],
  )

  const toggleSelectedPhoto = useCallback((index: number) => {
    setSelectedPhotoIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index)
      }
      return [...prev, index]
    })
  }, [])

  return {
    outputPhotoIndices,
    outputPhotos,
    outputPoseTitles,
    toggleSelectedPhoto,
  }
}
