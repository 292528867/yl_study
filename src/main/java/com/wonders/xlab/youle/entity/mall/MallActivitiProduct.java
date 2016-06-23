package com.wonders.xlab.youle.entity.mall;

import com.wonders.xlab.youle.entity.mall.MallActiviti.ActivitiType;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 商城活动关联商品实体，try类型的，参考{@link ActivitiType}。
 * @author xu
 *
 */
@Entity
@Table(name = "YL_MALL_ACTIVITI_PRODUCT")
@EntityListeners(AuditingEntityListener.class)
public class MallActivitiProduct {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/** 业务主键 */
	@EmbeddedId
	private MallActivitiProductPK pk;
	
	/** 关联商品生效开始时间 */
	@Temporal(TemporalType.TIMESTAMP)
	private Date validStartTime;
	/** 关联商品生效结束时间 */
	@Temporal(TemporalType.TIMESTAMP)
	private Date validEndTime;
	/** 关联的商品总数量 */
	private Integer totalCount;
	/** 关联的商品剩余数量 */
	private Integer count;
	/** 所需积分 */
	private Integer score;
	
	/** 是否上下架 */
	@Type(type="yes_no")
	private boolean enabled;

    @CreatedDate
	@Temporal(TemporalType.TIMESTAMP)
	@Column(updatable = false)
    private Date createdDate;

    @LastModifiedDate
	@Temporal(TemporalType.TIMESTAMP)
    private Date lastModifiedDate;

	public String toHtmlString() {
		if (pk.getMallActiviti().getType() == ActivitiType.TRY) {
			return "活动名称：" + pk.getMallActiviti().getActivitiName() + "</br>" +
					"总试用数量：" + totalCount + "</br>" +
					"剩余数量：" + count + "</br>" +
					"开始时间：" + new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss").format(validStartTime) + "</br>" +
					"结束时间：" + new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss").format(validEndTime);
		} else if (pk.getMallActiviti().getType() == ActivitiType.NORMAL) {
			return "活动名称：" + pk.getMallActiviti().getActivitiName();
		} else {
			return "未知活动";
		}
	}



	public MallActivitiProductPK getPk() {
		return pk;
	}
	public void setPk(MallActivitiProductPK pk) {
		this.pk = pk;
	}
	public Date getValidStartTime() {
		return validStartTime;
	}
	public void setValidStartTime(Date validStartTime) {
		this.validStartTime = validStartTime;
	}
	public Date getValidEndTime() {
		return validEndTime;
	}
	public void setValidEndTime(Date validEndTime) {
		this.validEndTime = validEndTime;
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
	public Integer getScore() {
		return score;
	}
	public void setScore(Integer score) {
		this.score = score;
	}
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getLastModifiedDate() {
		return lastModifiedDate;
	}

	public void setLastModifiedDate(Date lastModifiedDate) {
		this.lastModifiedDate = lastModifiedDate;
	}

	public boolean isEnabled() {
		return enabled;
	}
	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public Integer getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(Integer totalCount) {
		this.totalCount = totalCount;
	}
}
