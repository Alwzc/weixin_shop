<?php

namespace Opening\Storage\Drivers;

interface DriverInterface
{
    function put($localFile, $saveTo);
}