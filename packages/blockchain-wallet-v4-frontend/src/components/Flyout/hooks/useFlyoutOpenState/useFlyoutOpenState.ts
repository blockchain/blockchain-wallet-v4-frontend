import { useCallback, useState } from "react";
import { FlyoutOpenStateHook } from "./useFlyoutOpenState.types";
import { duration as defaultDuration } from "./../../"

export const useFlyoutOpenState: FlyoutOpenStateHook = ({ duration = defaultDuration, initialValue = false, onClose = () => null } = {}) => {
    const [isOpen, setOpen] = useState<boolean>(initialValue)

    const onPressClose = useCallback(() => {
        setOpen(false)

        setTimeout(onClose, duration)
    }, [duration, setOpen, onClose]);

    return {
        onPressClose,
        isOpen,
    }
}