<?php

namespace Opening\Event;

interface Dispatchable
{
    public function onDispatch(EventArgument $arg);
}
