package com.wonders.xlab.youle.entity.base;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.AbstractPersistable;

import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import java.io.Serializable;
import java.util.Date;

import static javax.persistence.TemporalType.TIMESTAMP;

/**
 * Created by Jeffrey on 15/8/12.
 */
@MappedSuperclass
public abstract class BaseEntity<ID extends Serializable> extends AbstractPersistable<ID> {

    @CreatedDate
    @Temporal(TIMESTAMP)
    private Date createdDate;

    @LastModifiedDate
    @Temporal(TIMESTAMP)
    private Date lastModifyDate;

    /**
     * 备注
     */
    private String remark;

    public BaseEntity() {
        super();
    }

    public BaseEntity(Date createdDate, Date lastModifyDate, String remark) {
        this.createdDate = createdDate;
        this.lastModifyDate = lastModifyDate;
        this.remark = remark;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getLastModifyDate() {
        return lastModifyDate;
    }

    public void setLastModifyDate(Date lastModifyDate) {
        this.lastModifyDate = lastModifyDate;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public boolean isEmpty() {
        return null == this || null == this.getId();
    }
}
