<?php

namespace Opening\Storage\Components;

use Opening\Storage\UploadedFile;
use Opening\Storage\Drivers\BaseDriver;

/**
 * Storage component
 *
 * @property \Opening\Drivers\BaseDriver $driver
 * @property string $basePath
 */
class StorageComponent extends \yii\base\Component
{
    private $driver;

    protected $basePath;

    public function getDriver()
    {
        if ($this->driverInstance === null) {
            $this->setDriver([
                'class' => 'Opening\Storage\Drivers\Local'
            ]);
        }
        return $this->driverInstance;
    }

    public function setDriver($value)
    {
        if (is_array($value)) {
            $this->driverInstance = \Yii::createObject($value);
        } else {
            $this->driverInstance = $value;
        }
    }

    protected function getDriverInstance()
    {
        return $this->driver;
    }

    protected function setDriverInstance($value)
    {
        if (!($value instanceof BaseDriver)) {
            throw new \InvalidArgumentException('Driver must be a instance of BaseDriver');
        }
        $this->driver = $value;
    }

    public function getBasePath()
    {
        return $this->basePath;
    }

    public function setBasePath($value)
    {
        $this->basePath = $value;
    }

    /**
     * Uploaded file getter
     *
     * @param string $name
     * @return UploadedFile
     */
    public function getUploadedFile($name)
    {
        return UploadedFile::getInstanceByStorage($name, $this->driver, $this->basePath);
    }
}
